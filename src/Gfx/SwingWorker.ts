

// see getValue(), setValue()
/** 
     * Class to maintain reference to current worker thread
     * under separate synchronization control.
     */
class ThreadVar
{
	private thread:Thread;constructor(t:Thread)
	{
		this.thread = t;
	}

	get():Thread
	{
		return this.thread;
	}

	clear():void
	{
		this.thread = null;
	}
}
import { InterruptedException } from '../java/lang/InterruptedException';
import { Thread } from '../java/lang/Thread';
import { Runnable } from '../java/lang/Runnable';
/**
 * This is the 3rd version of SwingWorker (also known as
 * SwingWorker 3), an abstract class that you subclass to
 * perform GUI-related work in a dedicated thread.  For
 * instructions on and examples of using this class, see:
 * 
 * http://java.sun.com/docs/books/tutorial/uiswing/misc/threads.html
 *
 * Note that the API changed slightly in the 3rd version:
 * You must now invoke start() on the SwingWorker after
 * creating it.
 */
import { SwingUtilities } from '../javax/swing/SwingUtilities';

export abstract class SwingWorker
{
	private value:any;
	private threadVar:ThreadVar;

	/** 
     * Get the value produced by the worker thread, or null if it 
     * hasn't been constructed yet.
     */
	public getValue():any
	{
		return this.value;
	}

	/** 
     * Set the value produced by worker thread 
     */
	private setValue(x:any):void
	{
		this.value = x;
	}

	public abstract construct():any;

	/**
     * Called on the event dispatching thread (not on the worker thread)
     * after the <code>construct</code> method has returned.
     */
	public finished():void
	{
	}

	/**
     * A new method that interrupts the worker thread.  Call this method
     * to force the worker to stop what it's doing.
     */
	public interrupt():void
	{
		let t:Thread = this.threadVar.get();
		if( t != null)
			{
				t.interrupt();
			}

		this.threadVar.clear();
	}

	/**
     * Return the value created by the <code>construct</code> method.  
     * Returns null if either the constructing thread or the current
     * thread was interrupted before a value was produced.
     * 
     * @return the value created by the <code>construct</code> method
     */
	public get():any
	{
		while( true)
		{
			let t:Thread = this.threadVar.get();
			if( t == null)
				{
					return this.getValue();
				}

			try
			{
				t.join();
			}
			catch( e)
			{
				if( e instanceof InterruptedException)
					{
						Thread.currentThread().interrupt();
						return null;
					}

				else
					throw e;

			}
		}
	}
	// propagate
	/**
     * Start a thread that will call the <code>construct</code> method
     * and then exit.
     */
	public constructor()
	{
		let doFinished:Runnable =
		{

			run:():void =>
			{
				this.finished();
			}
		}
		;
		let doConstruct:Runnable =
		{

			run:():void =>
			{
				try
				{
					this.setValue(this.construct());
				}
				catch( e)
				{
				}
				SwingUtilities.invokeLater(doFinished);
			}
		}
		;
		let t:Thread = new Thread(doConstruct);
		this.threadVar = new ThreadVar(t);
	}

	/**
     * Start the worker thread.
     */
	public start():void
	{
		let t:Thread = this.threadVar.get();
		if( t != null)
			{
				t.start();
			}

	}
}
