import { useRouter } from "next/navigation";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { LoaderCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const Password = () => {
    const router = useRouter();
    const [loadingNextPage, setLoadingNextPage] = useState(false);
    const [randomNumber, setRandomNumber] = useState<number | null>(null);

    useEffect(() => {
        setRandomNumber(Math.floor(Math.random() * 5));
    }, []);

    const FormSchema = z.object({
        pin: z.string().min(4, {
            message: "Your one-time password must be 6 characters.",
        }),
    })
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        if (String(JSON.stringify(data, null, 2)).includes("2424")) {
            router.push("/single/2424?redirected-from-settings=true");
        }

        setLoadingNextPage(true);
    }

    return (
        <>
            <div className="flex justify-between items-center gap-4 p-4 rounded-xl bg-primary-foreground/80 border border-muted">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="mx-auto w-fit flex flex-col gap-5 justify-center items-center">
                        <FormField
                            control={form.control}
                            name="pin"
                            render={({ field }) => (
                                <FormItem className="flex flex-col place-items-center">
                                    <FormLabel className='font-bold text-xl'>Enter the secret code</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup className="gap-2 rounded-2xl">
                                                <InputOTPSlot index={0} className="rounded-r-lg border" />
                                                <InputOTPSlot index={1} className="rounded-lg border" />
                                                <InputOTPSlot index={2} className="rounded-lg border" />
                                                <InputOTPSlot index={3} className="rounded-l-lg border" />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className={cn("flex justify-center items-center rounded-xl", loadingNextPage && "cursor-progress")} disabled={loadingNextPage}>
                            {loadingNextPage && <LoaderCircleIcon className="animate-spin" size={16} aria-hidden="true" />}
                            {!loadingNextPage && "Submit"}
                        </Button>
                    </form>
                </Form>
            </div>
            {(randomNumber !== null && randomNumber === 0) &&
                <p className="text-center mt-4 text-muted-foreground opacity-75">The passcode is 2424 btw</p>
            }
        </>
    )
}