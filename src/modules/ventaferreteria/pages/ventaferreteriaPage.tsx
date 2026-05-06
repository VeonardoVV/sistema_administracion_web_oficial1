import { useState } from "react";
import style from "./ventaferreteriaPage.module.css";
import Seccion_1 from "../components/seccion_1/seccion_1";


export default function VentaFerreteria() {
  const [vista, setVista] = useState("monitor");

  return (
    <div className={style.contenidoferreteria}>



        <Seccion_1 />
        
    </div>
  );
}