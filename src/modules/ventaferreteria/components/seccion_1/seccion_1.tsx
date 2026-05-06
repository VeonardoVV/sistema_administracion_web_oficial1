import { useEffect, useState } from "react";
import styles from "./seccion_1.module.css";
import { supabase } from "../../../../app/services/apiSupabase";

type Venta = {
  id_venta: number;
  fecha: string;
  nombre_completo: string;
  dni: string;
};

type DetalleVenta = {
  id_detventa: number;
  cantidad: number;
  id_producto: number;
  id_venta: number;
};

const Seccion_1 = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [detalles, setDetalles] = useState<DetalleVenta[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: ventasData } = await supabase
        .from("ventas")
        .select("*");

      const { data: detallesData } = await supabase
        .from("detalle_venta")
        .select("*");

      setVentas(ventasData || []);
      setDetalles(detallesData || []);
    };

    fetchData();
  }, []);

  return (
    <div className={styles.seccion}>

      {/* TABLA VENTAS */}
      <h2>Ventas</h2>
      <table border={1}>
        <thead>
          <tr>
            <th>id_venta</th>
            <th>fecha</th>
            <th>nombre_completo</th>
            <th>dni</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((v) => (
            <tr key={v.id_venta}>
              <td>{v.id_venta}</td>
              <td>{v.fecha}</td>
              <td>{v.nombre_completo}</td>
              <td>{v.dni}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TABLA DETALLE VENTA */}
      <h2>Detalle de Ventas</h2>
      <table border={1}>
        <thead>
          <tr>
            <th>id_detventa</th>
            <th>cantidad</th>
            <th>id_producto</th>
            <th>id_venta</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((d) => (
            <tr key={d.id_detventa}>
              <td>{d.id_detventa}</td>
              <td>{d.cantidad}</td>
              <td>{d.id_producto}</td>
              <td>{d.id_venta}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default Seccion_1;