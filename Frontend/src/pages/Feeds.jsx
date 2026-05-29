import {useEffect, useState} from 'react'
import axios from 'axios'
import style from './Feeds.module.css'

const Feeds = () => {
    const [posts, setPost] = useState([
    //   {  _id:"1",
    //     image:"https://ik.imagekit.io/demo/default-image.jpg",
    //     caption:"Beautiful Scenery"
    //   }
     ])

useEffect(()=>{
   axios.get("http://localhost:3000/getpost")
   .then((res)=>{
    setPost(res.data.posts)
   })
},[])

  return (
   <>
   <section className={style.feedSection}>
   {posts.length > 0 ? (posts.map((post)=>(
      <div key={post._id} className={style.Card}>
    <div className={style.imageWrapper} ><img className={style.image} src={post.image} alt={post.caption}/>
          </div>
           <p className={style.para}>{post.caption}</p>
          </div>
 )) ):(
 <h1 className={style.heading}>No post availble</h1>
 )
}
   </section>
   </>
)
}
export default Feeds