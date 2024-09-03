import { EnumOption } from "@/shared/enums/enum-option";
import { NullEnumOption } from "@/shared/models/null-enum-option";

export enum OrderStatus {
  NEW_ORDER = "new_order",
  ONPROGRESS = "onprogress",
  UNPAID = "unpaid",
  PAID = "paid",
}

export namespace OrderStatus {
  export function getValues(): EnumOption<OrderStatus>[] {
    return [
      {
        id: OrderStatus.NEW_ORDER,
        text: `Pesanan baru`,
        icon: "clock",
        color: "gray-700",
        bgColor: "default",
        desc: "Pesanan baru di buat.",
      },
      {
        id: OrderStatus.ONPROGRESS,
        text: `Sedang Diproses`,
        icon: "clock",
        color: "blue-700",
        bgColor: "blue",
        desc: "sedang diproses.",
      },
      {
        id: OrderStatus.UNPAID,
        text: `Belum Bibayar`,
        icon: "clock",
        color: "yellow-700",
        bgColor: "destructive",
        desc: "belum dibayar.",
      },
      {
        id: OrderStatus.PAID,
        text: `Sudah Dibayar`,
        icon: "clock",
        color: "green-700",
        bgColor: "success",
        desc: "sudah dibayar.",
      },
    ];
  }

  export function find(id: string): EnumOption<OrderStatus> {
    const found = OrderStatus.getValues().find((item) => item.id === id);

    if (found) {
      return found;
    }

    return new NullEnumOption();
  }
}
