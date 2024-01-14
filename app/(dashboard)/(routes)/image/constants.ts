import * as z from 'zod';

// export const formSchema = z.object({
//     prompt: z.string().min(1, {
//         message: 'Image prompt is required',
//     }),
//     amount: z.string().min(1),
//     resolution: z.string().min(1),
// })

export interface MonsterImageResponse {
  process_id: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'IN_QUEUE' | 'FAILED';
  result: {
    output: string[];
  };
  credit_used: number;
  overage: number;
}

export const formSchema = z.object({
    prompt: z.string().min(1, {
        message: 'Image prompt is required',
    }),
    negativePrompt: z.string().min(1, {
        message: 'Negative prompt is optional',
    }),
    aspectRatio: z.string().min(1),
    samples: z.string().min(1),
    style: z.string().min(1),
})

export const aspectRatioOptions = [
    {
        value: "portrait",
        label: "Portrait"
    },
    {
        value: "square",
        label: "Square"
    },
    {
        value: "landscape",
        label: "Landscape"
    }
]

 export const sampleOptions = [
     {
         value: "1",
         label: "1 photo"
     },
     {
         value: "2",
         label: "2 photos"
     },
     {
         value: "3",
         label: "3 photos"
     },
     {
         value: "4",
         label: "4 photos"
     }
 ];

 export const styleOptions = [
    {
        value: "enhance",
        label: "Enhance"
    },
    {
        value: "anime",
        label: "Anime"
    },
    {
        value: "photographic",
        label: "Photographic"
    },
    {
        value: "digital-art",
        label: "Digital Art"
    },
    {
        value: "comic-book",
        label: "Comic Book"
    },
    {
        value: "fantasy-art",
        label: "Fantasy Art"
    },
    {
        value: "analog-film",
        label: "Analog Film"
    },
    {
        value: "neonpunk",
        label: "Neonpunk"
    },
    {
        value: "isometric",
        label: "Isometric"
    },
    {
        value: "lowpoly",
        label: "Lowpoly"
    },
    {
        value: "origami",
        label: "Origami"
    },
    {
        value: "line-art",
        label: "Line Art"
    },
    {
        value: "craft-clay",
        label: "Craft Clay"
    },
    {
        value: "cinematic",
        label: "Cinematic"
    },
    {
        value: "3d-model",
        label: "3D Model"
    },
    {
        value: "pixel-art",
        label: "Pixel Art"
    },
    {
        value: "texture",
        label: "Texture"
    },
    {
        value: "futuristic",
        label: "Futuristic"
    },
    {
        value: "realism",
        label: "Realism"
    },
    {
        value: "watercolor",
        label: "Watercolor"
    },
    {
        value: "photorealistic",
        label: "Photorealistic"
    }
 ]

// export const resolutionOptions = [
//     {
//         value: "256x256",
//         label: "256x256"
//     },
//     {
//         value: "512x512",
//         label: "512x512"
//     },
//     {
//         value: "1024x1024",
//         label: "1024x1024"
//     }
// ]