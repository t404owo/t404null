import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://owbamcqdmqetrgcznxva.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im93YmFtY3FkbXFldHJnY3pueHZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI5NDU5NjIsImV4cCI6MjAzODUyMTk2Mn0.xNen7b513ZGwJ-Qu5iZ6K8qrmvy4QVjS10wiYbEEwKc";
//anon key, you cant access private stuffs or add hilarious stuffs w/ this...
//(unless sending me some malicious links but I delete your msg)
//the moment you notice you need an API endpoint.
const supabase = createClient(supabaseUrl, supabaseKey);

const   form = document.getElementById("mail-form"),
        nameInput = document.getElementById("name"),
        emailInput = document.getElementById("email"),
        subjectInput = document.getElementById("subject"),
        messageInput = document.getElementById("message"),
        statusMessage = document.querySelector(".box");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();

    try {
    
        [name, email, subject, message].forEach(obj =>
            if (!obj || obj.length===0) {
                throw new Error("field_missing");
            }
        });
    
        const { data, error } = await supabase
            .from("mail")
            .insert([{ name, email, subject, message }]);

        if (error) {
            throw error;
        }

        statusMessage.textContent = "Message sent successfully!";
        statusMessage.style = "background: #DDF6D2";
        form.reset();
    } catch (error) {
        console.error("Error sending message:", error);
        statusMessage.textContent = (error.message === "field_missing") ?
        /*if (error==="field_missing")*/    
            "Please fill in all fields." :
        /*else*/
            "Error sending message. Please try again.";
        statusMessage.style = "background: #FFDCDC";
    }
});
