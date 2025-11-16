"use client"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Upload() {
    const [text, setText] = useState("");
    
    async function save() {
        const {
            data: { user },
            error: userError
    } = await supabase.auth.getUser()
    if (userError || !user) {
        alert("You must be logged in.")
        return;
    }
        const { error } = await supabase.from("lectures").insert({
            title: "New Lecture",
            transcript: text,
            user_id: user?.id
        })
        if (error) alert(error.message)
        else alert("Saved!")
    }

    return (
        <div>
            <textarea
                className="border p-2 w-full"
                rows={10}
                onChange={(e) => setText(e.target.value)}
            />
            <button
                className="mt-4 bg-blue-500 text-white px-4 py-2"
                onClick={save}
            >
                Save Lecture
            </button>
        </div>
    )
}