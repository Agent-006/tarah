// types/prisma.d.ts
import { Decimal } from "@prisma/client/runtime/library";

declare module "@prisma/client" {
    interface Decimal {
        toJSON(): string;
    }
}

Decimal.prototype.toJSON = function() {
    return this.toString();
};