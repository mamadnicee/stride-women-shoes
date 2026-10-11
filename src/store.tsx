import {getProduct} from "./data/products";
import React,{createContext,useContext,useEffect,useState} from 'react';
export type CartItem={id:string;size:number;qty:number};
type ShopCtx={cart:CartItem[];wishlist:string[];cartOpen:boolean;addToCart:(id:string,size:number,qty?:number)=>void;updateQty:(id:string,size:number,delta:number)=>void;removeItem:(id:string,size:number)=>void;toggleWish:(id:string)=>void;setCartOpen:(v:boolean)=>void;count:number;total:number};
const C=createContext<ShopCtx|null>(null);
const load=()=>{try{return JSON.parse(localStorage.getItem('stride-shop')||'{}')}catch{return{}}};
export function ShopProvider({children}:{children:React.ReactNode}){
 const init=load() as {cart?:CartItem[];wishlist?:string[]};
 const [cart,setCart]=useState<CartItem[]>(init.cart||[]);
 const [wishlist,setWishlist]=useState<string[]>(init.wishlist||[]);
 const [cartOpen,setCartOpen]=useState(false);
 useEffect(()=>{localStorage.setItem('stride-shop',JSON.stringify({cart,wishlist}))},[cart,wishlist]);
 const addToCart=(id,size,qty=1)=>setCart(c=>{const i=c.findIndex(x=>x.id===id&&x.size===size);if(i>-1){const n=[...c];n[i]={...n[i],qty:n[i].qty+qty};return n}return[...c,{id,size,qty}]});
 const updateQty=(id,size,delta)=>setCart(c=>c.map(x=>x.id===id&&x.size===size?{...x,qty:Math.max(1,x.qty+delta)}:x));
 const removeItem=(id,size)=>setCart(c=>c.filter(x=>!(x.id===id&&x.size===size)));
 const toggleWish=id=>setWishlist(w=>w.includes(id)?w.filter(x=>x!==id):[...w,id]);
 const count=cart.reduce((a,x)=>a+x.qty,0);
 return <C.Provider value={{cart,wishlist,cartOpen,addToCart,updateQty,removeItem,toggleWish,setCartOpen,count,total:cart.reduce((a,x)=>a+x.qty*(getProduct(x.id)?.price??0),0)}}>{children}</C.Provider>;
}
export const useShop=()=>{const c=useContext(C);if(!c)throw new Error('ShopProvider missing');return c};