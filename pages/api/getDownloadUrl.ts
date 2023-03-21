import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios';

const qs = require('qs');

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const getUniqueParam = (token: string) => {
        for (var a = "", t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789", n = t.length, o = 0; 10 > o; o++)
            a += t.charAt(Math.floor(Math.random() * n));

        return a + `?token=${token}&expiry=` + Date.now();
    }
    const userAgent = req.headers['user-agent']
    const axiosClient = axios.create({
        headers: {
            'User-Agent': userAgent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Referer': 'https://dood.yt',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
        }
    })

    const pass_md5 = req.body.pass_md5
    const token = req.body.token

    try {
        if (pass_md5 == undefined) {
            throw new Error("Required parameter `pass_md5`");
        }
        if (token == undefined) {
            throw new Error("Required parameter `token`");
        }

        var response = await axiosClient.get(`https://dood.yt/pass_md5/${pass_md5}`)

        var url = response.data + getUniqueParam(token)

        var getSizeResponse = await axiosClient.head(url)
        var sizeFile = getSizeResponse.headers['content-length']

        res.status(200).json({
            result: true,
            data: {
                url: url,
                size: sizeFile
            }
        })

    } catch (error: Error | any) {
        res.status(400).json({ result: false, message: error.message })
    }

}