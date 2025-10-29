

export class GridBagConstraints
{ 
	public constructor ( ) 
	{ 
	} 
	
	public static REMAINDER: number = -1;
    public static WEST: number = 0;
    


    public gridx: number = 0;
    public gridy: number = 0;
    public gridwidth: number = 1;
    public weightx: number = 0;
    public anchor: number = GridBagConstraints.WEST;

    _copy():GridBagConstraints
    {
        var out:GridBagConstraints = new GridBagConstraints();
        out.gridx = this.gridx;
        out.gridy = this.gridy;
        out.gridwidth = this.gridwidth;
        out.weightx = this.weightx;
        out.anchor = this.anchor;

        return out;
    }

//new
    public static EAST:number = 1;

    public static LINE_START:number = 2;

    public LINE_START:number =2;

    gridheight:number = 1;
	
} 

