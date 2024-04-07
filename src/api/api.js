export const getAIMessage = async (userQuery) => {
    const apiUrl = 'http://localhost:8000/part_query'; // Replace this with your actual API URL

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: userQuery }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json(); // Now you can read the response since no-cors mode is not used

        return {
            role: "assistant",
            content: data.answer, // Use the actual data from the server response
        };
    } catch (error) {
        console.error("Failed to fetch AI message:", error);
        return {
            role: "assistant",
            content: "Sorry, there was an error processing your request.",
        };
    }
};
