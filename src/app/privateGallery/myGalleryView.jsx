export default function MyGalleryView({ savePicture, loadGallery, pictures }) {
    return (
        <div>
            <h1>Gallery</h1>
            <button onClick={savePicture}>Save Picture</button>
            <button onClick={loadGallery}>Load Gallery</button>
            {pictures.map((picture, index) => (
                <img key={index} src={picture} alt="User pic" />
            ))}
            <p>Blablabla</p>
        </div>
    );
}