import { useMutation, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-hot-toast";

const useFollow = () => {

    const queryClient = useQueryClient();

    const { mutate: follow, isPending } = useMutation({
        mutationFn: async (userId) => {
            try {
                const res = await fetch(`/api/users/follow/${userId}`, {
                    method: "POST",
                })

                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong")
                }

                return data;
            } catch (error) {
                throw new Error(error);
            }
        },
        onSuccess: () => {
            Promise.all([
                queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }), // to update the right panel following list
                queryClient.invalidateQueries({ queryKey: ["authUsers"] }) // to update profile user follow button
            ])
            toast.success("User followed sucessfully");
        },
        onError: (error) => {
            toast.error(error.message)
        }
    });


    return { follow, isPending };
};

export default useFollow;