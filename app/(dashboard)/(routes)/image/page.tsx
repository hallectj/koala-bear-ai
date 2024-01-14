"use client"

import * as z from "zod";
import Heading from "@/components/heading"
import { Download, ImageIcon } from "lucide-react"
import { set, useForm } from "react-hook-form"
//import { amountOptions, resolutionOptions, formSchema } from "./constants";
import {  aspectRatioOptions, sampleOptions, styleOptions, formSchema, MonsterImageResponse } from "./constants";
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
import { Textarea } from "@/components/ui/textarea"

const ImagePage = () => {
    const router = useRouter();
    const { toast } = useToast()
    const [error, setError] = useState<string | null>(null);
    const [images, setImages] = useState<string[]>([]);
    const [ userPrompt, setUserPrompt ] = useState<string>("");
    const [ isAIThinking, setIsAIThinking ] = useState<boolean>(false);
    const [ isCancelRequest, setIsCancelRequest ] = useState<boolean>(false);
    const [ values, setValues ] = useState<z.infer<typeof formSchema>>({
      prompt: "",
      negativePrompt: "",
      aspectRatio: "portrait",
      samples: "1",
      style: "enhance",
    });
   
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          prompt: "",
          negativePrompt: "",
          aspectRatio: "portrait",
          samples: "1",
          style: "enhance",
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
      setIsCancelRequest(false);
      try { 
        const resp = await axios.post("/api/image", values)
        if(resp.status !== 200){
          setError("Something went wrong, and internal server error occurred status code 500.")
          setIsAIThinking(false);
          setImages([]);
          setUserPrompt("");
          return;
        }

        if(resp.status === 200){
          setUserPrompt(values.prompt);
  

          const process_id = resp.data.process_id;                ;
          if(!process_id){
            setError("process_id is null or undefined.")
            return;
          }
          
          let result = await axios.get(`/api/imageresults?process_id=${process_id}`);    
          
          if(!result){
            setError("statusObj is null or undefined.")
            return;
          }

          let seconds = 0;

          let statusObj: MonsterImageResponse = result.data.data;
          
          let interval = setInterval(async () => {
            seconds = (seconds + 3000) / 1000;
            result = await axios.get(`/api/imageresults?process_id=${process_id}`);
            statusObj = result.data.data;

            if(isCancelRequest || seconds > 60){
              clearInterval(interval);
              setIsCancelRequest(false);
              setIsAIThinking(false);
              return;
            }

            if(statusObj.status === "COMPLETED" || statusObj.status === "FAILED"){
              clearInterval(interval);
              setIsCancelRequest(false);
              setIsAIThinking(false);
              setValues(values);

              form.setValue("prompt", values.prompt);
              form.setValue("aspectRatio", values.aspectRatio);
              form.setValue("samples", values.samples);
              form.setValue("style", values.style);
              form.setValue("negativePrompt", values.negativePrompt);

              if(statusObj.status === "FAILED"){
                setError("The AI failed to generate an image, please try again.")
                setImages([]);
                return;
              }else if(statusObj.status === "COMPLETED"){
                setImages([...statusObj.result.output]);
                setError(null);
                return;
              }
            }

          }, 3000);
          
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
                    <FormItem className="col-span-12 ">
                      <FormControl className="m-0 p-0">
                      <Textarea required={true}
                        className="focus-visible:ring-0 focus-visible:ring-transparent" 
                        disabled={isLoading} 
                        placeholder={userPrompt || "A picture of a happy little koala bear in the forest."} 
                        {...field }
                      />
                      </FormControl>
                    </FormItem>
                )} 
              />

              <div className="flex justify-between col-span-12 gap-4">
                <div className="flex flex-wrap flex-1">
                  <FormField 
                    control={form.control}
                    name="aspectRatio"
                    render={ ({ field }) => (
                    <FormItem className="flex-1 mr-1 col-span-12 lg:col-span-2 mb-4">
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
                      {aspectRatioOptions.map((option) => {
                        return (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                      )})}
                      </SelectContent>
                      </Select> 
                    </FormItem>
                    )}
                  />
                                
                  <FormField 
                    control={form.control}
                    name="samples"
                    render={ ({ field }) => (
                    <FormItem className="flex-1 mr-1 col-span-12 lg:col-span-2 mb-4">
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
                        {sampleOptions.map((option) => {
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          )})}
                      </SelectContent>
                      </Select> 
                    </FormItem>
                    )}
                  />


                  <FormField 
                    control={form.control}
                    name="style"
                    render={ ({ field }) => (
                    <FormItem className="flex-1 mr-1 col-span-12 lg:col-span-2 mb-4">
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
                        {styleOptions.map((option) => {
                          return (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          )})}
                      </SelectContent>
                      </Select> 
                    </FormItem>
                    )}
                  />
                </div>

                <div className="flex flex-wrap gap-3 flex-2">
                  <Button className="col-span-12 lg:col-span-2 w-full" disabled={isLoading}>Generate</Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 col-span-12">
                <FormField 
                    control={form.control}
                    name="negativePrompt"
                    render={ ({ field }) => (
                      <FormItem className="flex-1 mr-1 col-span-12 lg:col-span-2 mb-4">
                        <Input defaultValue={field.value} type="text" placeholder="Negative Prompt such as: deformed, bad anatomy, disfigured, poorly drawn face, mutation, mutated, extra limb" />
                      </FormItem>
                    )}
                  />
              </div>
             
            </form>
          </Form>
        </div>

        {isAIThinking && (<CustomLoader />)}

          <div className="mt-4 space-y-4">
            {images.length === 0 && !isAIThinking && (
              <Empty  label={"KoalaBear AI will display your images here when it is finished."} imgSrc={'/empty.png'} />
            )}
          <div className="w-full mb-4">{userPrompt}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {images.map((src) => {
              return (
                <Card key={src} className="rounded-lg overflow-hidden">
                  <div className="relative aspect-square">
                    <Image alt="image" fill src={src} />
                  </div>
                  <CardFooter className="p-2">
                    <Button variant="secondary" className="w-full" onClick={() => window.open(src)}>
                      <Download className="w-4 h-4 mr-2" />Download</Button>
                  </CardFooter>
                </Card>
              )})}
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