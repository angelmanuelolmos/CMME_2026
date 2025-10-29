
export class AffineTransform
{
    public _matrix:DOMMatrix;

    public constructor(matrix:DOMMatrix)
    {
        this._matrix = matrix;
    }

    public rotate(theta:number):void
    {
        throw new Error();
    }
}