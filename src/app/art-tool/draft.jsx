const testCSS = "bg-yellow-100 border border-red-600  w-2/4 h-2/4 left-1/4 top-1/4 z-30 "
function Draft(props) {
    return(
        <div id="draft-parent" className={testCSS + " absolute text-black flex flex-col items-center"}>
            <h1 className="text-center text-4xl font-bold m-4">YOUR DRAFTS</h1>
            <div id="draft-images" className="grid grid-cols-3 gap-6">
                {props.model.pictures.map(renderImages)}
            </div>
        </div>
    )
    function renderImages(img) {
        return (
            <div className="flex flex-col w-40 h-20">
                <img key={img.id} src={img.testPicture} alt="" />
                <div className="flex flex-row">
                    <p className="text-nowrap overflow-x-clip text-ellipsis" title={img.title + " by " + img.creator}> {img.title + " by " + img.creator}</p>
                </div>
            </div>
        ) 
    }
}
export default Draft