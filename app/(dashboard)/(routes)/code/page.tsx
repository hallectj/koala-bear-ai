"use client"

import * as z from "zod";
import Heading from "@/components/heading"
import { Code, MessageSquare } from "lucide-react"
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
import { CreateChatCompletionRequestMessage } from "openai/resources/index.mjs";
import Empty  from "@/components/empty";
import CustomLoader from "@/components/loader";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/user-avatar";
import BotAvatar from "@/components/bot-avatar";
import ReactMarkdown from "react-markdown";

const CodePage = () => {
    const router = useRouter();
    const { toast } = useToast()
    const [messages, setMessages] = useState<CreateChatCompletionRequestMessage[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [ isAIThinking, setIsAIThinking ] = useState<boolean>(false);
   
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            prompt: ""
        }
    });

    useEffect(() => {
        console.log("the error", error);
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
            const userMessage: CreateChatCompletionRequestMessage = {
                role: "user",
                content: values.prompt
            }
            
            const newMessages = [...messages, userMessage];

            const resp = await axios.post("/api/code", {
                messages: newMessages
            });

            if(resp.status === 500){
                setError("Something went wrong, and internal server error occurred status code 500.")
                setIsAIThinking(false);
                return;
            }

            if(resp.status === 200){
                setMessages((current) => [...current, userMessage, resp.data]);
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
              title={"Code Generation"} 
              description={"Use the power of AI to generate code for you."} 
              icon={Code}
              iconColor={"text-green-700"}
              bgColor={"bg-green-700/10"}
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
                                        placeholder="Create a Ceasar Cipher function in JavaScript." 
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

                <div className="mt-4 space-y-4">
                  {
                    messages.length === 0 && !isAIThinking && (
                      <Empty  label={"Type in a prompt above and click the generate button. Koalabear AI will display the answer here when it is finished."} imgSrc={'/empty.png'} />
                    )
                  }
                  <div className="flex flex-col gap-y-4">
                    {messages.map((message) => (
                      <div 
                        key={message.content as any}
                        className={cn("p-8 w-full flex items-start rounded-lg gap-8", message.role === 'user' ? 'bg-white border border-black/10' : 'bg-muted')}
                      >
                        {message.role === 'user' ? (<UserAvatar />) : (<BotAvatar />)}
                        <ReactMarkdown components={
                          {
                            pre: ({node, ...props}) => {
                              return ( 
                                <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                  <pre {...props} />
                                </div>
                              )
                            },
                            code: ({node, ...props}) => {
                              return ( 
                                <code className="bg-black/10 rounded-lg p-1" {...props} />
                              )
                            }
                          }
                        }
                        className={"text-sm overflow-hidden leading-7"}
                        >
                          {message.content as any || ""}
                        </ReactMarkdown>
                      </div>
                    ))}

                  </div>
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

export default CodePage;