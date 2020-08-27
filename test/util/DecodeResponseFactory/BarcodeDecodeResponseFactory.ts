import * as t from "io-ts";

import { Barcode } from "../../../src";
import { BarcodeDecodeC } from "../../../src/resources/barcodes/codec";
import { DecodeResponseFactory } from "./DecodeResponseFactory";
import {
  getSingleBarcodeResponseFactoryList,
  HeaderSingleDecodeResponseFactory,
  OperatorSingleDecodeResponseFactory,
  SingleDecodeResponseFactory,
  MismatchSingleDecodeResponseFactory,
  MachineSingleDecodeResponseFactory,
  CollocationSingleDecodeResponseFactory,
} from "./SingleDecodeResponseFactory";

export type BarcodeDecodeResponseFactory = DecodeResponseFactory<
  Barcode.BarcodeDecode
>;

export abstract class AbstractBarcodeDecodeResponseFactory
  implements BarcodeDecodeResponseFactory {
  singleFactoryList: SingleDecodeResponseFactory[];

  constructor(singleFactoryList: SingleDecodeResponseFactory[] = []) {
    this.singleFactoryList = singleFactoryList;
  }

  input() {
    return this.singleFactoryList.map((factory) => factory.input());
  }
  output() {
    return this.singleFactoryList.map((factory) => factory.output());
  }
  codec(): t.Decoder<unknown, Barcode.BarcodeDecode> {
    return BarcodeDecodeC;
  }
}

export class AllBarcodeDecodeResponseFactory extends AbstractBarcodeDecodeResponseFactory {
  constructor(
    singleFactoryList: SingleDecodeResponseFactory[] = getSingleBarcodeResponseFactoryList(),
  ) {
    super(singleFactoryList);
  }
}

export class RepeatedBarcodeDecodeResponseFactory extends AbstractBarcodeDecodeResponseFactory {
  constructor() {
    super([
      new OperatorSingleDecodeResponseFactory(),
      new MachineSingleDecodeResponseFactory(1),
      new CollocationSingleDecodeResponseFactory(),
      new MachineSingleDecodeResponseFactory(2),
      new MachineSingleDecodeResponseFactory(3),
    ]);
  }
}

export class EmptyBarcodeDecodeResponseFactory extends AbstractBarcodeDecodeResponseFactory {
  constructor() {
    super([]);
  }
}

export class ButMachineBarcodeDecodeResponseFactory extends AbstractBarcodeDecodeResponseFactory {
  constructor() {
    super([
      new OperatorSingleDecodeResponseFactory(),
      new HeaderSingleDecodeResponseFactory(),
    ]);
  }
}

export class MismatchBarcodeDecodeResponseFactory extends AbstractBarcodeDecodeResponseFactory {
  constructor() {
    super([
      new OperatorSingleDecodeResponseFactory(),
      new MismatchSingleDecodeResponseFactory(),
    ]);
  }
}
