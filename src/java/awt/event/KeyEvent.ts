
import {Component } from '../Component'; 
import {InputEvent } from './InputEvent'; 
export class KeyEvent extends InputEvent 
{ 
	public static KEY_PRESSED:number = 0;

	public constructor(source:Component, id:number, when:number, modifiers:number, keyCode:number, keyChar:string)
	{
		super(source, modifiers);

		this.id = id;
		this.when = when;
		this.keyCode = keyCode;
		this.keyChar = keyChar;
	}

	id:number;
	when:number;	
	keyCode:number;
	keyChar:string

	public static VK_BACK_SPACE: number = 8;
    public static VK_TAB: number = 9;
    public static VK_ENTER: number = 10;
    public static VK_SHIFT: number = 16;
    public static VK_CTRL: number = 17;
    public static VK_ALT: number = 18;
    public static VK_PAUSE: number = 19;
    public static VK_CAPS_LOCK: number = 20;
    public static VK_ESCAPE: number = 27;
    public static VK_SPACE: number = 32;
    public static VK_PAGE_UP: number = 33;
    public static VK_PAGE_DOWN: number = 34;
    public static VK_END: number = 35;
    public static VK_HOME: number = 36;
    public static VK_LEFT: number = 37;
    public static VK_UP: number = 38;
    public static VK_RIGHT: number = 39;
    public static VK_DOWN: number = 40;
    public static VK_COMMA: number = 44;
    public static VK_PERIOD: number = 46;
    public static VK_SLASH: number = 47;
    public static VK_0: number = 48;
    public static VK_1: number = 49;
    public static VK_2: number = 50;
    public static VK_3: number = 51;
    public static VK_4: number = 52;
    public static VK_5: number = 53;
    public static VK_6: number = 54;
    public static VK_7: number = 55;
    public static VK_8: number = 56;
    public static VK_9: number = 57;
    public static VK_SEMICOLON: number = 59;
    public static VK_EQUALS: number = 61;
    public static VK_A: number = 65;
    public static VK_B: number = 66;
    public static VK_C: number = 67;
    public static VK_D: number = 68;
    public static VK_E: number = 69;
    public static VK_F: number = 70;
    public static VK_G: number = 71;
    public static VK_H: number = 72;
    public static VK_I: number = 73;
    public static VK_J: number = 74;
    public static VK_K: number = 75;
    public static VK_L: number = 76;
    public static VK_M: number = 77;
    public static VK_N: number = 78;
    public static VK_O: number = 79;
    public static VK_P: number = 80;
    public static VK_Q: number = 81;
    public static VK_R: number = 82;
    public static VK_S: number = 83;
    public static VK_T: number = 84;
    public static VK_U: number = 85;
    public static VK_V: number = 86;
    public static VK_W: number = 87;
    public static VK_X: number = 88;
    public static VK_Y: number = 89;
    public static VK_Z: number = 90;
    public static VK_OPEN_BRACKET: number = 91;
    public static VK_BACK_SLASH: number = 92;
    public static VK_CLOSE_BRACKET: number = 93;
    public static VK_CIRCUMFLEX: number = 94;
    public static VK_UNDERSCORE: number = 95;
    public static VK_BACKQUOTE: number = 96;
    public static VK_QUOTE: number = 222;
	public static VK_DELETE: number = 127;

    public static VK_KP_0: number = 48;
    public static VK_KP_1: number = 49;
    public static VK_KP_2: number = 50;
    public static VK_KP_3: number = 51;
    public static VK_KP_4: number = 52;
    public static VK_KP_5: number = 53;
    public static VK_KP_6: number = 54;
    public static VK_KP_7: number = 55;
    public static VK_KP_8: number = 56;
    public static VK_KP_9: number = 57;
    public static VK_KP_LEFT: number = 37;
    public static VK_KP_RIGHT: number = 39;
    public static VK_KP_UP: number = 38;
    public static VK_KP_DOWN: number = 40;

	public static VK_COLON: number = 58;       // The colon (:) key
public static VK_NUMBER_SIGN: number = 35;  // The number sign (#), also known as the hash or pound key
public static VK_PLUS: number = 43;        // The plus (+) key
public static VK_MINUS: number = 45;

	public getKeyCode():number
	{
		return this.keyCode;
	}

	public getKeyChar():number
	{
		return this.keyChar.charCodeAt(0);
	}
	
} 

