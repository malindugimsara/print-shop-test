import { useState } from "react"

export default function Test1 (){
    const [images, setImages] = useState([]);

    function handleUpload(){
        mediaUpload()
    }

    return (
        <div className="pt-50">

            <input
                    // value={images}
                    onChange={(e) => setImages(e.target.files)} 
                    multiple
                     className="w-[400px] h[50px] border border-gray-500 rounded-xl text-center m-[10px]" type="file" placeholder="Images" />

            <button className="bg-red-500 p-2">upload</button>
        </div>
    )
}
