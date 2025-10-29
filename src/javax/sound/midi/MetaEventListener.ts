import { MetaMessage } from "./MetaMessage";

export interface MetaEventListener
{
    meta(meta:MetaMessage):void
}