import { TW_centered, TW_titleText, TW_window } from "./tailwindClasses";

function Draft(props) {
    return(
        <div id="draft-parent" className="z-30">
            <div id="content" className={TW_centered + TW_window + "flex flex-col items-center"}>
                <h1 className= {TW_titleText + "m-4"}>YOUR DRAFTS</h1>
                <div id="draft-images" className="grid grid-cols-3 gap-6 draft-images-container borderborder-white border-s-8 ">
                    {props.model.images.map(renderImages)}
                </div>
            </div>
        </div>
    )
    function renderImages(img) {
        return (
            <div key={img.id} className="flex flex-col items-center w-full h-auto mb-4 img-hover-effect" onClick={() => handleImgClick(img)}>
                <img src={img.testPicture} alt="" className="w-full mb-2 image-pixelated" />
                <div className="text-center w-full">
                <p className="break-words" title={`${img.title} Created by: ${img.creator}`}>
                    {img.title}<br /> Created by: {img.creator}
                </p>
                </div>
            </div>
        ) 

        function handleImgClick(img) {
            // console.log("clicked on img: ", img);
            // console.log("props: ", props);
            props.overwriteCanvas(img.testPicture);
            
        }
    }
}
export default Draft