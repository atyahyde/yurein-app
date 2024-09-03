import { EnumOption } from "@/shared/enums/enum-option";
import { NullEnumOption } from "@/shared/models/null-enum-option";

export enum PaymentType {
  CASH = "cash",
  TRANSFER = "onprogress",
}

export namespace PaymentType {
  export function getValues(): EnumOption<PaymentType>[] {
    return [
      {
        id: PaymentType.CASH,
        text: `Bayar Cash`,
        icon: "clock",
        color: "warning-dark",
        bgColor: "warning-light",
        desc: "Pembayaran langsung cash",
      },
      {
        id: PaymentType.TRANSFER,
        text: `Bayar Transfer`,
        icon: "clock",
        color: "warning-dark",
        bgColor: "warning-light",
        desc: "Pembayaran transfer melalui ATM atau M-Banking",
      },
    ];
  }

  export function find(id: string): EnumOption<PaymentType> {
    const found = PaymentType.getValues().find((item) => item.id === id);

    if (found) {
      return found;
    }

    return new NullEnumOption();
  }
}
