import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGift,
  faSpinner,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";

function App() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    wants: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isErrored, setIsErrored] = useState(false);
  

  // Handle form changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const response = await fetch(
      "https://uvah6098hh.execute-api.us-east-1.amazonaws.com/register",
      {
        method: "POST",
        body: JSON.stringify(formData),
      }
    );
    if (response && response.status === 200) {
      setIsSubmitted(true);
      setIsSubmitting(false);
    } else {
      setIsErrored(true);
    }
  };

  return (
    <div className="bg-standard bg-cover bg-center w-full h-screen items-center  justify-center flex flex-col">
      <div className="rounded-md w-[400px] max-w-[90vw] h-fit gap-4 bg-red-500 bg-opacity-80 flex flex-col p-10 py-20 items-center justify-start text-white shadow-lg shadow-white">
        <h1 className="text-4xl text-center font-bold mb-2">
          Intercambio X-Mas
        </h1>
        {isErrored && (
          <div className="flex items-center justify-center gap-4">
            <FontAwesomeIcon className="w-8 h-8" icon={faTimesCircle} />
            <p className="text-base">
              Ups! Algo salio mal, intentalo de nuevo.
            </p>
          </div>
        )}
        {!isErrored &&
          (isSubmitted ? (
            <div className="flex items-center justify-center gap-4">
              <FontAwesomeIcon className="w-8 h-8" icon={faGift} />
              <p className="text-base">
                Listo! Recibiras un email en unos dias.
              </p>
            </div>
          ) : (
            <form
              className="w-full flex flex-col gap-4"
              onSubmit={handleSubmit}
            >
              <p className="text-sm font-bold">
                ¿Quieres participar en el intercambio? ¡Llena el formulario!
              </p>
              <label className="w-full flex flex-col">
                <span className="text-xs font-bold">nombre</span>
                <input
                  id="name"
                  name="name"
                  maxLength={50}
                  required
                  value={formData.name}
                  onChange={handleChange}
                  type="text"
                  className="bg-transparent w-full border-b-2"
                />
              </label>
              <label className="w-full flex flex-col">
                <span className="text-xs font-bold">email</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="bg-transparent w-full border-b-2"
                />
              </label>
              <label className="w-full flex flex-col">
                <span className="text-xs font-bold">
                  quisiera que me regalaran{" "}
                  <span className="font-extrabold">(max. $50)</span>
                </span>
                <textarea
                  name="wants"
                  value={formData.wants}
                  onChange={handleChange}
                  required
                  id="wants"
                  className="bg-transparent w-full border-b-2"
                  maxLength={200}
                />
              </label>
              <button
                disabled={isSubmitting}
                className={` ${
                  isSubmitting ? "animate-pulse" : null
                } bg-white text-red-600 font-bold hover:shadow-lg hover:shadow-white hover:border-zinc-200 border-b border-white w-full py-3 rounded-md mt-4 flex justify-between px-4 items-center`}
              >
                {isSubmitting ? "procesando..." : "Quiero Participar!"}
                <FontAwesomeIcon
                  icon={isSubmitting ? faSpinner : faCheckCircle}
                  className={`${isSubmitting ? "animate-spin" : null}`}
                />
              </button>
            </form>
          ))}
      </div>
    </div>
  );
}

export default App;
