// import { useState } from "react"
// import heroImg from "./assets/hero.png"
// import reactLogo from "./assets/react.svg"
// import viteLogo from "./assets/vite/.svg"
import "./App.css"
import axios from "axios"

function App() {

    let types = ["normal", "fighting", "flying", "poison", "ground", "rock", "bug", "ghost", "steel", "fire", "water", "grass", "electric", "psychic", "ice", "dragon", "dark", "fairy", "stellar"]


    const getPokemonDetails = async (url) => {
        let response = await axios.get(url)
        console.log("this is response from getPokemonDetails: ", response.data)
        // let img = response.data.sprites.front_default
        // let name = response.data.name
        // to make it cleaner, we are going to return an object
        return {
            img: response.data.sprites.front_default,
            name: response.data.name
        }
    } 


    const insertCard = (pokemonData) => {
        // we deconstructed pokemonData and took only the name and img
        let {name, img} = pokemonData
        let card = document.createElement("div")
        let h6 = document.createElement("h6")
        let imgElement = document.createElement("img")
        imgElement.src = img
        h6.innerText = name
        card.appendChild(imgElement)
        card.appendChild(h6)
        card.className = "card"
        let container = document.getElementById("container")
        container.appendChild(card)
    }

    const getPokemonByType = async() => {
        // this random number generator is inclusive, all numbers have a chance to be chosen
        let randomIdx = Math.floor(Math.random() * types.length)
        console.log(randomIdx)
        console.log(types[randomIdx])
        // adding the one so the list reads plain english, ex. idx zero is list item 1 out of total count of list
        console.log("type chosen is:", types[randomIdx], ": ",randomIdx + 1, " out of ", types.length)

        let selectedType = types[randomIdx]
        
        let myType = document.getElementById("my-type")
        myType.innerText = `As a trainer, you like ${selectedType} types!! Here is your team!`

        let res = await axios.get(`https://pokeapi.co/api/v2/type/${selectedType}/`)
        console.log(res.data)
        console.log("this type has: ",res.data.pokemon.length, " pokemon!")

        let teamOfSix = []
        while (teamOfSix.length < 6){
            let randomPokemon = Math.floor(Math.random() * res.data.pokemon.length)
            if (teamOfSix.includes(res.data.pokemon[randomPokemon])){
               randomPokemon = randomPokemon + 1
            }
            teamOfSix.push(res.data.pokemon[randomPokemon])
        }
        console.log("this is teamOfSix: ", teamOfSix)

        // this is what the instructor did so it brings back the first six pokemon on the list, I instead bring back 6 random pokemon from the entire list of pokemon with that type
        // let pokemon = res.data.pokemon.slice(0,6)
        // console.log(pokemon)
        let pokemon = teamOfSix
        console.log("This is now the team of pokemon: ", pokemon[0].pokemon)

        let teamData = await Promise.all(
            pokemon.map(async(poke) => (
                await getPokemonDetails(poke.pokemon.url)
            )))
        console.log("this is teamData from the Promises: ",teamData)

        teamData.map((data)=> insertCard(data))


      

    }

    return (
        <>
            <h1>Pokemon Dream Team</h1>
            <h2 id="my-type">Everybody has a type! What kind of Pokemon trainer are you?!</h2>
            <button onClick={getPokemonByType}>Get Team</button><br /><br />
            <div id="container" style={{display:"flex", flexWrap: "wrap", gap:"2vmin"}}>

            </div>
        </>
    )

}

export default App