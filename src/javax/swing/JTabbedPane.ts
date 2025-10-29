import { Component } from "../../java/awt/Component";
import { JComponent } from "./JComponent";


export class JTabbedPane extends JComponent
{
    public constructor()
    {
        super("div", ["JTabbedPane"]);

        this._getHTMLElement().style.display = "flex";
        this._getHTMLElement().style.flexDirection = "column";
    }

    private tabs: Array<{ title: string, component: Component, tabContainer:HTMLDivElement }> = [];
    private selectedTabIndex: number = 0; // To track the currently selected tab


    public addTab(title: string, component: Component): void
    {
        
        var tabIndex:number = this.tabs.length;
        
        const tabButton = document.createElement("button");
        tabButton.classList.add("JTabbedPane_button");
        tabButton.textContent = title;
        tabButton.addEventListener("click", () => this.selectTab(tabIndex));
        this._getHTMLElement().appendChild(tabButton);

        // Add the component to the container but don't display it initially
        const tabContainer:HTMLDivElement = document.createElement("div");
        tabContainer.classList.add("JTabbedPane_container");
        tabContainer.style.display = "none"; // Hide it initially
        tabContainer.appendChild(component._getHTMLElement());
        this._getHTMLElement().appendChild(tabContainer);

        this.tabs.push({ title, component, tabContainer });

        this.selectTab(0);
    }

    private selectTab(index: number): void {
        if (index >= 0 && index < this.tabs.length)
        {
            this.tabs[this.selectedTabIndex].tabContainer.style.display = "none";
            this.tabs[index].tabContainer.style.display = "block";
            this.selectedTabIndex = index;
        }
    }
}