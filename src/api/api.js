export const getAIMessage = async (userQuery) => {
    const apiUrl = 'https://casestudy-backend.ue.r.appspot.com/part_query';

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

        const data = await response.json();

        return {
            role: "assistant",
            content: data.answer,
        };
    } catch (error) {
        console.error("Failed to fetch AI message:", error);
        return {
            role: "assistant",
            content: "Sorry, there was an error processing your request.",
        };
    }
};


export const clearRecentQueries = async () => {
    const clearQueriesUrl = 'https://casestudy-backend.ue.r.appspot.com/clear_query';

    try {
        const response = await fetch(clearQueriesUrl, { method: 'GET' });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error("Failed to clear recent queries:", error);
        return "Failed to clear recent queries";
    }
};
