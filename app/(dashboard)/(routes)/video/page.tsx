"use client"

import * as z from "zod";
import Heading from "@/components/heading"
import { MessageSquare, MusicIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { formSchema } from "./constants";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from 'axios'
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
//import { ChatCompletionMessageParam } from "openai/resources/chat";
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"
import Empty  from "@/components/empty";
import CustomLoader from "@/components/loader";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/user-avatar";
import BotAvatar from "@/components/bot-avatar";

const VideoPage = () => {
    const router = useRouter();
    const { toast } = useToast()
    const [video, setVideo] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [ isAIThinking, setIsAIThinking ] = useState<boolean>(false);
   
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            prompt: ""
        }
    });

    useEffect(() => {
        let timer: any = undefined;
        if(error !== null && timer === undefined){
            timer = setTimeout(() => {
              setError(null);
              clearTimeout(timer);
              timer = undefined;
            }, 5000);
        }
    }, [error]);

   
    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsAIThinking(true);
        try {           
            setVideo(""); 
            const resp = await axios.post("/api/video", values);

            if(resp.status === 500){
                setError("Something went wrong, and internal server error occurred status code 500.")
                setIsAIThinking(false);
                setVideo('');
                return;
            }

            if(resp.status === 200){
                setVideo(resp.data[0]);
                setIsAIThinking(false);
                setError(null);
            }

            form.reset();

        } catch (error: any) {
            console.log(error);
            setError(error.message);
            setIsAIThinking(false);
            //TODO Pro Modal
        } finally{
            router.refresh();
        }
    }


    return (
        <div>
            <Heading 
              title={"Video"} 
              description={"Turn your prompt into a video"} 
              icon={MusicIcon}
              iconColor={"text-orage-700"}
              bgColor={"bg-orange-700/10"}
            />

            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField 
                              name="prompt"
                              render={({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-10 ">
                                    <FormControl className="m-0 p-0">
                                      <Input 
                                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent" 
                                        disabled={isLoading} 
                                        placeholder="A video of a cat playing the piano" 
                                        {...field }
                                      />
                                    </FormControl>
                                </FormItem>
                              )} 
                            />
                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                                Generate
                            </Button>
                        </form>
                    </Form>
                </div>

                {
                  isAIThinking && (
                    <CustomLoader />
                  )
                }

                <div className="mt-4 space-y-4 w-full">
                  {
                    video === "" && !isAIThinking && (
                      <Empty  label={"Koalabear AI will take your prompt and make a video out of it. Please be patient though as videos can sometimes take up to a minute to generate."} imgSrc={'/empty.png'} />
                    )
                  }
                  {
                    !!video && !isAIThinking && (
                      <video className="m-8 rounded-lg aspect-video border bg-black" controls>
                        <source src={video} type="video/mp4" />
                      </video>
                    )
                  }
                </div>
            </div>
            {error && (
                <div className="bg-red-500 text-white p-4 rounded-lg">
                    An error has occurred {error}
                </div>
            )}
        </div>
    )
}

export default VideoPage;