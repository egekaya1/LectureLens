"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { User } from "@supabase/supabase-js"

export default function AuthStatus() {
    const [user, setUser] = useState<null | User>(null)
    const [loading, setLoading] = useState(true)
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUser(data.user)
            setLoading(false)
        })
        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null)
            }
        )
        return () => listener.subscription.unsubscribe()
    }, [])
    if(loading) return <p>Loading..</p>
    if (!user) return <p>Not logged in.</p>
    return <p>Logged in as: { user.email }</p>
}