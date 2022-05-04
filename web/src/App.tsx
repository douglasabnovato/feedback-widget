interface ButtonProps{
  text?: string;
}

function Button(props: ButtonProps){
  return <button>{props.text ?? "Default"}</button>
}

function App(){
  return (
    <div>
      <Button text="Enviar" />
      <Button text="OK" />
      <Button />
    </div>
  )
}

export default App
