/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "oaidalleapiprodscus.blob.core.windows.net",
            "processed-model-result.s3.us-east-2.amazonaws.com"
        ]
    }
}

module.exports = nextConfig
