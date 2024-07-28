export default function PlaceImg({place,index=0,className=null}){
    if (!place.photos?.length){
        return '';
    }
    if (!className){
        className = 'rounded-2xl w-full object-cover aspect-square';
    }
    return (
        <img className={className} src={place.photos[index]} alt=""/>
    );
}