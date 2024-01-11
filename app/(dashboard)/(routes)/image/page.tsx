"use client"

import * as z from "zod";
import Heading from "@/components/heading"
import { Download, ImageIcon } from "lucide-react"
import { set, useForm } from "react-hook-form"
import { amountOptions, resolutionOptions, formSchema } from "./constants";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardFooter } from "@/components/ui/card";
import Image from "next/image";

const ImagePage = () => {
    const router = useRouter();
    const { toast } = useToast()
    const [error, setError] = useState<string | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [ userPrompt, setUserPrompt ] = useState<string>("");
    const [ isAIThinking, setIsAIThinking ] = useState<boolean>(false);
   
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues:{
            prompt: "",
            amount: "1",
            resolution: "512x512"
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
            
            const resp = await axios.post("/api/image", values)

            if(resp.status === 500){
                setError("Something went wrong, and internal server error occurred status code 500.")
                setIsAIThinking(false);
                setImages([]);
                setUserPrompt("");
                return;
            }

            if(resp.status === 200){
                setIsAIThinking(false);
                setError(null);
                setImages([]);
                setUserPrompt(values.prompt);
            }

            const urls = resp.data.map((image: { url: string}) => {
              return image.url;
            });

            setImages(urls);
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
              title={"Image"} 
              description={"Turn your prompt into an image."} 
              icon={ImageIcon}
              iconColor={"text-pink-700"}
              bgColor={"bg-pink-700/10"}
            />

            <div className="px-4 lg:px-8">
                <div>
                    <Form {...form}>
                        <form className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField 
                              name="prompt"
                              render={({ field }) => (
                                <FormItem className="col-span-10 ">
                                    <FormControl className="m-0 p-0">
                                      <Input 
                                        className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent" 
                                        disabled={isLoading} 
                                        placeholder="A picture of a happy little koala bear in the forest." 
                                        {...field }
                                      />
                                    </FormControl>
                                </FormItem>
                              )} 
                            />

                            <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>
                                Generate
                            </Button>

                            <FormField 
                              control={form.control}
                              name="amount"
                              render={ ({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-2">
                                  <Select
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                    value={field.value}
                                    disabled={isLoading}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue defaultValue={field.value} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {
                                        amountOptions.map((option) => {
                                          return (
                                            <SelectItem key={option.value} value={option.value}>
                                              {option.label}
                                            </SelectItem>
                                          )
                                        })
                                      }
                                    </SelectContent>
                                  </Select> 
                                </FormItem>
                              ) }
                            />
                            
                            <FormField 
                              control={form.control}
                              name="resolution"
                              render={ ({ field }) => (
                                <FormItem className="col-span-12 lg:col-span-2">
                                  <Select
                                    onValueChange={field.onChange} 
                                    defaultValue={field.value}
                                    value={field.value}
                                    disabled={isLoading}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue defaultValue={field.value} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {
                                        resolutionOptions.map((option) => {
                                          return (
                                            <SelectItem key={option.value} value={option.value}>
                                              {option.label}
                                            </SelectItem>
                                          )
                                        })
                                      }
                                    </SelectContent>
                                  </Select> 
                                </FormItem>
                              ) }
                            />
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
                    images.length === 0 && !isAIThinking && (
                      <Empty  label={"KoalaBear AI will display your images here when it is finished."} imgSrc={'/empty.png'} />
                    )
                  }
                  <div className="w-full mb-4">{userPrompt}</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {
                      images.map((src) => {
                        return (
                          <Card key={src} className="rounded-lg overflow-hidden">
                            <div className="relative aspect-square">
                              <Image alt="image" fill src={src} />
                            </div>
                            <CardFooter className="p-2">
                              <Button variant="secondary" className="w-full" onClick={() => window.open(src)}>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </CardFooter>
                          </Card>
                        )
                      })
                    }
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

export default ImagePage