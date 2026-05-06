import { useEffect, useState } from "react";
import { supabase } from "../../../../app/services/apiSupabase";
import styles from "./vender.module.css";


type Props = {
  prdcid: number;
  onVolver: () => void;
};

type Producto = {
  prdcid: number;
  prdcimgnombre: string;
  prdcimgnombrebucket: string;
  prdcprecio: number;
  prcdescripcion: string;
  prdcstock: number;
};

export default function Vender({ prdcid, onVolver }: Props) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [cantidad, setCantidad] = useState(1);

  const [nombre, setNombre] = useState("");
  const [dni, setDni] = useState("");

  const yapeImg = "/assets/img/yape.png";

  // 🔥 TRAER PRODUCTO
  useEffect(() => {
    const fetchProducto = async () => {
      const { data, error } = await supabase
        .from("producto")
        .select("*")
        .eq("prdcid", prdcid)
        .single();

      if (error) {
        console.error(error);
        return;
      }

      setProducto(data);
    };

    fetchProducto();
  }, [prdcid]);

  const total = producto ? producto.prdcprecio * cantidad : 0;

  // 🔥 CONFIRMAR VENTA
  const confirmarPago = async () => {
    if (!producto) return;

    // 1. crear venta
    const { data: venta, error: errVenta } = await supabase
      .from("ventas")
      .insert([
        {
          nombre_completo: nombre,
          dni: dni,
        },
      ])
      .select()
      .single();

    if (errVenta) return alert("Error venta");

    // 2. detalle venta
    const { error: errDet } = await supabase
      .from("detalle_venta")
      .insert([
        {
          cantidad,
          id_producto: producto.prdcid,
          id_venta: venta.id_venta,
        },
      ]);

    if (errDet) return alert("Error detalle");

    // 3. descontar stock
    const nuevoStock = producto.prdcstock - cantidad;

    await supabase
      .from("producto")
      .update({ prdcstock: nuevoStock })
      .eq("prdcid", producto.prdcid);

    alert("Venta registrada correctamente");
    onVolver();
  };

  if (!producto) return <p>Cargando...</p>;

  return (
    <div className={styles.container}>
      <button onClick={onVolver}>← Volver</button>

      <div className={styles.grid}>
        {/* IZQUIERDA */}
        <div>
          <img
            src={producto.prdcimgnombrebucket}
            alt={producto.prdcimgnombre}
            className={styles.img}
          />

          <h2>{producto.prdcimgnombre}</h2>
          <p>{producto.prcdescripcion}</p>

          <p>Stock: {producto.prdcstock}</p>

          <input
            type="number"
            min={1}
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
          />

          <h3>Total: S/ {total.toFixed(2)}</h3>
        </div>

        {/* DERECHA */}
        <div>
          <img src={yapeImg} alt="yape" className={styles.qr} />

          <input
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <input
            placeholder="DNI"
            maxLength={8}
            value={dni}
            onChange={(e) => setDni(e.target.value)}
          />

          <button onClick={confirmarPago}>
            Confirmar pago
          </button>
        </div>
      </div>
    </div>
  );
}