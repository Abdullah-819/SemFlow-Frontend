import { RingLoader } from "react-spinners"

const Spinner = () => {
  return (
    <div className="global-spinner">
      <RingLoader
        color="#7b5cff"
        size={56}
        speedMultiplier={1.2}
      />
    </div>
  )
}

export default Spinner
