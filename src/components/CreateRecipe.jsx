// pages/CreateRecipe.jsx
import { useState } from "react";
import { postJSON } from "@/api/client";

export default function CreateRecipe() {
  const [title,setTitle]=useState("");
  const [instructions,setInstr]=useState("");
  const [ingredients,setIng]=useState([{name:"",measure:""}]);

  const addRow =()=> setIng([...ingredients,{name:"",measure:""}]);
  const onChange=(i,field,val)=>{
    const copy=[...ingredients]; copy[i][field]=val; setIng(copy);
  };

  const save = async () => {
    await postJSON("/recipes", {
      title,
      instructions,
      ingredients: ingredients.filter(i=>i.name.trim())
    });
    alert("Saved!");   // navigate elsewhere
  };

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add your recipe</h1>
      <input value={title} onChange={e=>setTitle(e.target.value)}
             placeholder="Title" className="input" />
      <textarea value={instructions}
                onChange={e=>setInstr(e.target.value)}
                placeholder="Instructions" className="textarea" />
      <h3 className="mt-4 font-semibold">Ingredients</h3>
      {ingredients.map((ing,idx)=>(
        <div key={idx} className="flex gap-2 mb-2">
          <input value={ing.measure} onChange={e=>onChange(idx,"measure",e.target.value)} className="input w-24"/>
          <input value={ing.name} onChange={e=>onChange(idx,"name",e.target.value)} className="input flex-1"/>
        </div>
      ))}
      <button onClick={addRow} className="btn">+ Row</button>
      <button onClick={save}  className="btn-primary ml-4">Save</button>
    </div>
  );
}
