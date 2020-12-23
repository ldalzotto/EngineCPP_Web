import { router, Route } from "./framework.js"

/* ####### ARTICLE */

enum ArticleSectionType
{
    UNDEFINED = 0,
    PARAGRAPH = 1,
    IMAGE = 2,
    LIST = 3
};

class ArticleSection
{
    public type: ArticleSectionType;
    public index: number;

    public static build(p_type: ArticleSectionType, p_index: number): ArticleSection
    {
        let l_article_section: ArticleSection = new ArticleSection();
        l_article_section.index = p_index;
        l_article_section.type = p_type;
        return l_article_section;
    }
};

class ArticleSectionList
{
    public items: string[] = [];

    public static build(p_items: string[]): ArticleSectionList
    {
        let l_article_section_list = new ArticleSectionList();
        l_article_section_list.items = p_items;
        return l_article_section_list;
    };
}

class Article
{
    public title: string;
    public date: Date;
    public paragraphs: string[] = [];
    public images: string[] = [];
    public lists: ArticleSectionList[] = [];
    public section_indices: ArticleSection[] = [];

    public push_paragraph(p_content: string)
    {
        this.paragraphs.push(p_content);
        this.section_indices.push(ArticleSection.build(ArticleSectionType.PARAGRAPH, this.paragraphs.length - 1));
    };

    public push_image(p_image: string)
    {
        this.images.push(p_image);
        this.section_indices.push(ArticleSection.build(ArticleSectionType.IMAGE, this.images.length - 1));
    };

    public push_list(p_list: ArticleSectionList)
    {
        this.lists.push(p_list);
        this.section_indices.push(ArticleSection.build(ArticleSectionType.LIST, this.lists.length - 1));
    };
};

/* ####### STYLE_LAYOUT UTILS */

class Styles
{
    public static MainContainerClass: string = "main-container";
    public static Row: string = "row";
    public static Column: string = "column";
    public static Width_1_3: string = "w-1_3";
    public static Width_2_3: string = "w-2_3";
    public static Width_1_12: string = "w-1_12";
    public static Width_11_12: string = "w-11_12";
    public static Width_1: string = "w-1";
    public static TextCenter : string = "text-center";

    public static set(p_element:HTMLElement, p_styles:string[]){
        for(let i=0;i<p_styles.length;i++)
        {
            p_element.classList.add(p_styles[i]);
        }
    };
};

class PageLayout
{
    public static push_main_container(p_parent: HTMLElement): HTMLElement
    {
        let l_container = document.createElement("div");
        l_container.classList.add(Styles.MainContainerClass);
        return p_parent.appendChild(l_container);
    };

    public static push_row(p_parent: HTMLElement): HTMLElement
    {
        let l_row_element = document.createElement("div");
        l_row_element.classList.add(Styles.Row);
        return p_parent.appendChild(l_row_element);
    };

    public static push_column(p_parent: HTMLElement): HTMLElement
    {
        let l_column_element = document.createElement("div");
        l_column_element.classList.add(Styles.Column);
        return p_parent.appendChild(l_column_element);
    };

    public static push_column_width(p_parent: HTMLElement, p_width: string): HTMLElement
    {

        let l_column_element = PageLayout.push_column(p_parent);
        l_column_element.classList.add(p_width);
        return l_column_element;
    };

    public static push_small_title(p_parent: HTMLElement, p_text_content: string) : HTMLElement
    {
        return PageLayout.push_title(p_parent, 6, p_text_content);
    };

    public static push_medium_title(p_parent: HTMLElement, p_text_content: string) : HTMLElement
    {
        return PageLayout.push_title(p_parent, 4, p_text_content);
    };

    public static push_huge_title(p_parent: HTMLElement, p_text_content: string) : HTMLElement
    {
        return PageLayout.push_title(p_parent, 2, p_text_content);
    };

    public static push_title(p_parent: HTMLElement, p_h_number:number, p_text_content: string) : HTMLElement
    {
        let l_title = document.createElement(`h${p_h_number}`);
        l_title.textContent = p_text_content;
       return  p_parent.appendChild(l_title);
    };

    public static push_paragraph(p_parent: HTMLElement, p_text_content: string): HTMLElement
    {
      return  PageLayout.push_paragraph_internal(p_parent, 1, p_text_content);
    };

    public static push_paragraph_internal(p_parent: HTMLElement, p_indent_rem: number, p_text_content: string): HTMLElement
    {
        let l_paragraph = document.createElement("paragraph");
        PageLayout.push_indented_text(l_paragraph, p_indent_rem, p_text_content);
        return p_parent.appendChild(l_paragraph);
    };

    public static push_text(p_parent: HTMLElement, p_display_style : string, p_text_content: string) : HTMLElement
    {
        let l_paragraph_element = document.createElement("p");
        l_paragraph_element.style.display = p_display_style;
        l_paragraph_element.innerHTML += (p_text_content);
        return p_parent.appendChild(l_paragraph_element);
    };

    public static push_indented_text(p_parent: HTMLElement, p_indent_width_em: number, p_text_content: string)
    {
        let l_text_element = document.createElement("text");
        {
            let l_tab_element = document.createElement("span");
            l_tab_element.style.width = `${p_indent_width_em}em`;
            l_tab_element.style.display = "inline-block";
            l_text_element.appendChild(l_tab_element);
    
            PageLayout.push_inline_text(l_text_element, p_text_content);
        }
        return p_parent.appendChild(l_text_element);
    };

    public static push_inline_text(p_parent: HTMLElement, p_text_content: string) : HTMLElement
    {
        return PageLayout.push_text(p_parent, "inline", p_text_content);
    };

    public static push_block_text(p_parent: HTMLElement, p_text_content: string) : HTMLElement
    {
        return PageLayout.push_text(p_parent, "block", p_text_content);
    };

    public static push_list(p_parent: HTMLElement, p_items : string[]) : HTMLElement
    {
        let l_list_element = document.createElement("ul") as HTMLUListElement;
        for (let j = 0; j < p_items.length; j++)
        {
            let l_li = document.createElement("li") as HTMLElement;
            l_li.innerHTML += p_items[j];
            l_list_element.appendChild(l_li);
        }
       return  p_parent.appendChild(l_list_element);
    };

    public static push_image(p_parent: HTMLElement, p_url : string): HTMLElement
    {
        let l_image_container = document.createElement("image-block");
        l_image_container.classList.add(Styles.TextCenter);
        {
            let l_image = document.createElement("img") as HTMLImageElement;
            l_image.src = p_url;
            l_image_container.appendChild(l_image);
        }
        return p_parent.appendChild(l_image_container);
    }
};

class InnerHtml
{
    public static underline(p_content: string) : string
    {
        return `<u>${p_content}</u>`;
    }  
};

/* ####### CUSTOM HTML ELEMENT */

class TreeMenuItem
{
    public name:string;
    constructor(p_name:string)
    {
        this.name = p_name;
    }
}

class TreeMenuElementStyle
{
    public root_class: string[];
    public item_class: string[];
}

class TreeMenuElement
{
    public parent: HTMLElement;
    public root: HTMLElement;
    public items: TreeMenuItem[];

    public static build(p_parent:HTMLElement, p_items: TreeMenuItem[], p_style: TreeMenuElementStyle,
        p_on_menu_item_clicked: (p_index:number)=>(void)) : TreeMenuElement
    {
        let l_return:TreeMenuElement = new TreeMenuElement();
        l_return.parent = p_parent;
        l_return.root = PageLayout.push_column_width(l_return.parent, Styles.Width_1);
        Styles.set(l_return.root, p_style.root_class);
        l_return.items = p_items;

        for(let i=0;i<p_items.length;i++)
        {
            let l_item:HTMLElement =  PageLayout.push_row(l_return.root);
            Styles.set(l_item, p_style.item_class);
            PageLayout.push_block_text(l_item, p_items[i].name);
            l_item.addEventListener('click', () => { p_on_menu_item_clicked(i); });
        }

        return l_return;
    };
}

class ArticleElement
{
    public parent: HTMLElement;
    public root: HTMLElement;

    public static build(p_parent: HTMLElement, p_article: Article): ArticleElement
    {
        let l_root: HTMLElement = document.createElement("div");
        {
            let l_container = PageLayout.push_main_container(l_root);

            PageLayout.push_huge_title(l_container, p_article.title);
            
            {
                let l_date = document.createElement("div");
                l_date.textContent = p_article.date.toLocaleString();
                l_container.appendChild(l_date);
            }

            for (let i = 0; i < p_article.section_indices.length; i++)
            {
                switch (p_article.section_indices[i].type)
                {
                    case ArticleSectionType.PARAGRAPH:
                        PageLayout.push_paragraph(l_container, p_article.paragraphs[p_article.section_indices[i].index]);
                        break;
                    case ArticleSectionType.IMAGE:
                        PageLayout.push_image(l_container, p_article.images[p_article.section_indices[i].index]);
                        break;
                    case ArticleSectionType.LIST:
                        PageLayout.push_list(l_container, p_article.lists[p_article.section_indices[i].index].items);
                        break;
                }
            }
        }

        let l_article_element: ArticleElement = new ArticleElement();
        l_article_element.root = p_parent.appendChild(l_root);
        l_article_element.parent = p_parent;

        return l_article_element;
    };
}

class Pages
{
    public static Welcome: string = "/welcome";
    public static Engine: string = "/engine";
    public static Engine_Render: string = "/engine/render";
}

class HeaderMenuElement
{
    public static build(p_parent: HTMLElement): HeaderMenuElement
    {
        let l_headerMenuElement = new HeaderMenuElement();
        l_headerMenuElement.root = document.createElement("div");

        let l_row = PageLayout.push_row(l_headerMenuElement.root);
        {
            let l_welcome_page = PageLayout.push_column_width(l_row, Styles.Width_1_3);
            l_welcome_page.textContent = "WELCOME";
            l_welcome_page.addEventListener("click", () =>
            {
                router.navigate(Pages.Welcome);
            });
        }
        {
            let l_engine_page = PageLayout.push_column_width(l_row, Styles.Width_1_3);
            l_engine_page.textContent = "ENGINE";
            l_engine_page.addEventListener("click", () =>
            {
                router.navigate(Pages.Engine);
            });
        }

        p_parent.appendChild(l_headerMenuElement.root);
        return l_headerMenuElement;
    };

    public root: HTMLElement;
}

/* ####### APP */

let cteate_page_full_layout: (p_root:HTMLElement)=>(HTMLElement) = (p_root:HTMLElement ) => {

    let l_tree_pages = [
        Pages.Engine,
        Pages.Engine_Render,
        Pages.Welcome
    ];

    let l_tree_items = [
        new TreeMenuItem("Engine"),
        new TreeMenuItem("Render"),
        new TreeMenuItem("Welcome")
    ];

    let l_left_panel = PageLayout.push_column_width(app, Styles.Width_1_12);
    l_left_panel.style.position = "fixed";
    let l_shadow_left_panel = PageLayout.push_column_width(app, Styles.Width_1_12);
    l_shadow_left_panel.style.height = "1px";
    let l_container = PageLayout.push_column_width(app, Styles.Width_11_12);

    let l_tree_style:TreeMenuElementStyle = new TreeMenuElementStyle();
    l_tree_style.item_class= ["item"];
    l_tree_style.root_class= ["main-toc"];
    TreeMenuElement.build(l_left_panel, l_tree_items, l_tree_style, (p_index:number) => { router.navigate(l_tree_pages[p_index]); });

    return l_container;
}

let app = document.getElementById("app");

router.add(new Route(Pages.Welcome, (p_url: string) =>
{
    app.innerHTML = "";

    let l_main_container:HTMLElement = cteate_page_full_layout(app);

    let l_articles: Article[] = [];

    {
        let l_article: Article = new Article();
        l_article.title = "Welcome";
        l_article.date = new Date(Date.now());
        l_article.push_paragraph("This website is a notebook for myself for writing a custom engine.");
        l_articles.push(l_article);
    }

    {
        let l_article: Article = new Article();
        l_article.title = "Ver 0.0.1";
        l_article.date = new Date(Date.now());
        l_article.push_paragraph("This website is a notebook for myself for writing a custom engine.");
        l_articles.push(l_article);
    }

    {
        let l_article: Article = new Article();
        l_article.title = "Blender addons";
        l_article.date = new Date(Date.now());
        l_article.push_paragraph("This website is a notebook for myself for writing a custom engine.");
        let l_list = new ArticleSectionList();
        l_list.items.push("list1");
        l_list.items.push("list2");
        l_article.push_list(l_list);
        l_article.push_paragraph("This website is a notebook for myself for writing a custom engine.");
        l_articles.push(l_article);
    }

    for (let i = 0; i < l_articles.length; i++)
    {
        ArticleElement.build(l_main_container, l_articles[i]);
    }

    return true;
}));


router.add(new Route(Pages.Engine_Render, (p_url: string) =>{
    app.innerHTML = "";
    
    let l_main_container:HTMLElement = cteate_page_full_layout(app);
    {
        PageLayout.push_huge_title(l_main_container, "The Render Engine");

        PageLayout.push_medium_title(l_main_container, "Shader, Materials, ShaderParameters, RenderableObject");
        PageLayout.push_paragraph(l_main_container, "Shader is the result of the compilation of fragment and vertex. Materials is a list of shader parameters value. " +
            "Shader parameters are GPU buffers linked to material. RenderableObject is a combinaison of the 3D model, transformation matrix.");
        PageLayout.push_medium_title(l_main_container, "GPU Memory management");
        PageLayout.push_paragraph(l_main_container, "GPU Memory allocation is implemented as a heap. This means that the render engine has logic that reserve a slice of memory for any " +
            "requested buffer. GPU Memory is of two types, host visible or gpu only. When we want to write to GPUOnly memory, we created an intermediate host visible buffer to push data through the pipeline.");
        PageLayout.push_medium_title(l_main_container, "The draw loop");
        PageLayout.push_paragraph(l_main_container, "First step : deferred command operations (staging push, texture layout transition). "+
            "Second step : iterating over the tree (Shader->Material->RenderableObject) to render every renderable object with their associated material.");
        PageLayout.push_medium_title(l_main_container, "Asset graph");
        PageLayout.push_paragraph(l_main_container, "Showing the shader layout json, material json, shader json");
        PageLayout.push_medium_title(l_main_container, "Exposed handle graph");
    }

    return true;
}));

router.add(new Route(Pages.Engine, (p_url: string) =>{

    app.innerHTML = "";
   
    let l_container:HTMLElement = cteate_page_full_layout(app);
    let l_main_container = PageLayout.push_main_container(l_container);
    {
        PageLayout.push_huge_title(l_main_container, "The Engine");
        PageLayout.push_paragraph(l_main_container, "This project is a home made 3D game engine developped in c++. I created it to acquire knowledge on building a complex piece of software in C++.");
        PageLayout.push_medium_title(l_main_container, "Features");
        PageLayout.push_paragraph(l_main_container, "The engine support features that you can expect from any engine : ");
        PageLayout.push_list(l_main_container, [
                "Render engine : Common definitions of shader, material, mesh and texture.",
                "Asset database : Asset serialization to json with embedded database storage.",
                "Input : Input querying.",
                "Scene tree : A hierarchical 3D object tree.",
                "Components : Personalize scene nodes to make them interact with the world.",
                "Middleware systems : Functions that communicate between the scene and modules.",
                "Scene editor : Edit scene by adding scene nodes, component and visualizing changes at runtime."
        ]);

        PageLayout.push_medium_title(l_main_container, "Architecture");
        PageLayout.push_paragraph(l_main_container, "Every brick can be categorized into six types : ");
        PageLayout.push_image(l_main_container, "diagrams/EngineModulesLayered.png");
        PageLayout.push_list(l_main_container, [
            `${InnerHtml.underline("ThirdParty")} : Every third party libraries are treated as independant modules.`,
            `${InnerHtml.underline("Utility")} : Utility modules can be consumed by everyone. They definine custom container structures and mathematics representations.`,
            InnerHtml.underline("Middleware") + " : Middleware is the communication layer between the scene and the engine systems. It is at this level where 3D scene objects execute logic based on their components.",
            InnerHtml.underline("Systems") + " : Independant engine systems. They usually have one entry point that is executed every frame. Datas that are processed every frames are provided by the middleware.",
            InnerHtml.underline("Engine") + " : The engine creates all systems and execute the main loop.",
            InnerHtml.underline("Tools") + " : Engine tools are built above the engine. For example, the scene editor creates an instance of the engine to edit the selected scene."
        ]);

        PageLayout.push_medium_title(l_main_container, "Communication between scene and systems");
        PageLayout.push_paragraph(l_main_container, "The Scene is the heart of the engine. Every scene nodes can have multiple components. Components are plain data and doesn't execute logic, they can be seen as " +
        "tags that tells what the node is doing. The scene has callbacks that are triggered whenever a component is attached or removed.");
        PageLayout.push_paragraph(l_main_container, "The Middleware listens to these callbacks and based on the attached components and the attach or remove event, notify systems accordingly.");
        PageLayout.push_paragraph(l_main_container, "Scene node creation/deletion and Component attach/detach can occur anywhere in the main loop. It is up to the systems to decide whether internal allocations are performed on the fly or "
        + "deferred when the main loop calls them.");
        PageLayout.push_image(l_main_container, "diagrams/SceneCommunication.png");

        PageLayout.push_medium_title(l_main_container, "Main loop");
        
        PageLayout.push_paragraph_internal(l_main_container, 0, "NewFrame");
        PageLayout.push_paragraph_internal(l_main_container, 1, "Update clock state.");
        PageLayout.push_paragraph_internal(l_main_container, 1, "Consume input events.");
        PageLayout.push_paragraph_internal(l_main_container, 0, "Update");
        PageLayout.push_paragraph_internal(l_main_container, 1, "Set deltatime in clock state.");
        PageLayout.push_paragraph_internal(l_main_container, 1, "Render");
        PageLayout.push_paragraph_internal(l_main_container, 2, "Call RenderMiddleware");
        PageLayout.push_paragraph_internal(l_main_container, 3, "Push Camera buffers if changed.");
        PageLayout.push_paragraph_internal(l_main_container, 3, "Push RenderableObject buffers if changed.");
        PageLayout.push_paragraph_internal(l_main_container, 2, "Render draw");

        PageLayout.push_medium_title(l_main_container, "Asset management");
        PageLayout.push_paragraph(l_main_container, "During development, raw assets (3D models, textures, .json) are located in the Asset folder of the C++ project. " + 
        + "Human readable assets are then compiled to an internal format to be persisted in an embedded database. The AssetDatabase connection ans queries are handlesd by sqlite. "
        + "The target format depends of the original type of the human readable asset.");
        PageLayout.push_paragraph(l_main_container, "At runtime, assets are queried by their original relative path and deserialized from binary to C++ structs.");
        PageLayout.push_paragraph(l_main_container, "//TODO -> Asset graph.");

        PageLayout.push_medium_title(l_main_container, "Code structure");
        PageLayout.push_paragraph(l_main_container, "The philosophy of the engine source code is to : ");
        PageLayout.push_list(l_main_container, [
            "Use third party libraries as little as possible. The aim being to acquire knowledge as much as possible.",
            "Using C++ as \"C with template engine\". Other C++ features are almost never used.",
            "Avoiding nested vectors. Complex structures are flattended and nested vectors are replaced by indexes to the flattened structure.",
            "For a given structure allocated on the heap, instead of working with pointers that points to the heap position, we allocate the structure in an array and work with an index (or Token) that will be used by the container "
            + " to retrieve back the original data. This simplify serialization and keeps track of all allocations more easily.",
            "Communication between Middleware and systems is done exclusively with Tokens. Raw pointers are forbidden."
        ]);
    }
    
    return true;
}));


// On startup
router.interpretCurrentUrl();