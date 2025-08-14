import NavBar from "../components/Navbar";

function Home() {
  return (
    <>
      <NavBar/>
      <section className="Home">
        <h1>Home</h1>
        <h2>Pokemon Card Collection</h2>
        <p>Website created by Gabriel Quinn. Collect and claim cards.</p>
        <p>Use navigation at the top of the page to view the website.</p>
        <img src="../assets/homelogo.png" alt="" />
      </section>
    </>
  )
}

export default Home;