import Hello from "@/app/components/hello";

const Home = () => {
  console.log('Testing')

  return (
    <main>
      <div className="wrapper">
        <div id="pokemonIdentification"><span className="px-2" id="pokeID">id pokename</span></div>
        <div id="sprite">img</div>
        <input type="text" className="h-6 text-lg font-medium" placeholder="Search a pokémon!"></input>
      </div>
      
    </main>
  )
}

export default Home