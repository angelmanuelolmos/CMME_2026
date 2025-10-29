



import {Main as AppletMain } from "../Viewer/Main";
import {Main as DesktopMain } from "../Editor/Main";


import { Resources } from "../Util/Resources";

import { Applet } from "../java/applet/Applet";

declare global {
  interface String {
      replaceAll(regex: string, replacement: string): string;
      replaceFirst(regex: string, replacement: string): string;
      matches(regex: string): boolean;
      
      toCharArray():Array<string>
  }

  
}

String.prototype.replaceAll = function (regex: string, replacement: string): string {
  return this.replace(new RegExp(regex, "g"), replacement);
};

String.prototype.replaceFirst = function (regex: string, replacement: string): string {
  return this.replace(new RegExp(regex), replacement); // No "g" flag ensures only the first match is replaced
};

String.prototype.matches = function (regex: string): boolean {
  return new RegExp(`^(${regex})$`).test(this); // Wraps the pattern in ^ and $ to match the entire string
};

String.prototype.toCharArray = function (): Array<string> {
  return [...this];
};

async function awaitResources()
{
  await document.fonts.load('16px cmme');

  await Resources.boot();
}

async function run()
{
  await awaitResources();

  boot();
}

function boot()
{
  var applet:boolean = true;

  if( applet )
  {
    Applet._mapParams.set("file","Missa-Mort-et-Merci_01kyrie.cmme.xml" );

    var appletMain:AppletMain = new AppletMain();
    appletMain.init();
    appletMain.start();
  }

  else
  {
    DesktopMain.main(["Missa-Mort-et-Merci_01kyrie.cmme.xml"]);
  }

}

run();

