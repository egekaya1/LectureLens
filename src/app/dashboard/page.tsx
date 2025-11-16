"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Tables } from "@/types/supabase"
import { User } from "@supabase/supabase-js"

export default function Dashboard() {
    type Lecture = Tables<"lectures">

    const [user, setUser] = useState<User | null>(null)
    const [lectures, setLectures] = useState<Lecture[]>([])
    const [loading, setLoading] = useState(true)

    // 1) Load authenticated user
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user)
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        if (!user) return

        let mounted = true

        supabase
            .from("lectures")
            .select("*")
            .eq("user_id", user.id)
            .then(({ data }) => {
                if (mounted) setLectures(data || [])
            })

        return () => {
            mounted = false
        }
    }, [user])

    // UI Logic
    if (loading) return <p>Loading...</p>

    if (!user) return <p>You must log in to view your dashboard.</p>

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-4">My Lectures</h2>
            {lectures.length === 0 ? (
                <p>No lectures yet.</p>
            ) : (
                <ul>
                    {lectures.map((l) => (
                        <li key={l.id} className="mb-2 border p-3 rounded">
                            <strong>{l.title}</strong>
                            <div className="text-sm text-gray-600">
                                {l.transcript?.slice(0, 200)}...
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}