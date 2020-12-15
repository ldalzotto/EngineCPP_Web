import { router, Route } from "./framework.js"

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

class Styles
{
    public static MainContainerClass: string = "main-container";
    public static Row: string = "row";
    public static Column: string = "column";
    public static Width_1_3: string = "w-1_3";
};

class PageLayout
{
    public static push_main_container(p_parent: HTMLElement): HTMLElement
    {
        let l_container = document.createElement("div");
        l_container.classList.add(Styles.MainContainerClass);
        return p_parent.appendChild(l_container);
    };

    public static push_row(p_parent: HTMLElement, p_classes: string[]): HTMLElement
    {
        let l_row_element = document.createElement("div");
        l_row_element.classList.add(Styles.Row);
        for (let i = 0; i < p_classes.length; i++)
        {
            l_row_element.classList.add(p_classes[i]);
        }
        return p_parent.appendChild(l_row_element);
    };

    public static push_column(p_parent: HTMLElement, p_classes: string[]): HTMLElement
    {
        let l_column_element = document.createElement("div");
        l_column_element.classList.add(Styles.Column);
        for (let i = 0; i < p_classes.length; i++)
        {
            l_column_element.classList.add(p_classes[i]);
        }
        return p_parent.appendChild(l_column_element);
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
        let l_paragraph_element = document.createElement("p");
        l_paragraph_element.textContent = p_text_content;
        return p_parent.appendChild(l_paragraph_element);
    };

    public static push_list(p_parent: HTMLElement, p_items : string[]) : HTMLElement
    {
        let l_list_element = document.createElement("ul") as HTMLUListElement;
        for (let j = 0; j < p_items.length; j++)
        {
            let l_li = document.createElement("li") as HTMLElement;
            l_li.textContent = p_items[j];
            l_list_element.appendChild(l_li);
        }
       return  p_parent.appendChild(l_list_element);
    };
};


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
                        {
                            let l_image = document.createElement("img") as HTMLImageElement;
                            l_image.src = p_article.images[p_article.section_indices[i].index];
                            l_container.appendChild(l_image);
                        }
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
}

class HeaderMenuElement
{
    public static build(p_parent: HTMLElement): HeaderMenuElement
    {
        let l_headerMenuElement = new HeaderMenuElement();
        l_headerMenuElement.root = document.createElement("div");

        let l_row = PageLayout.push_row(l_headerMenuElement.root, []);
        {
            let l_welcome_page = PageLayout.push_column(l_row, [Styles.Width_1_3]);
            l_welcome_page.textContent = "WELCOME";
            l_welcome_page.addEventListener("click", () =>
            {
                router.navigate(Pages.Welcome);
            });
        }
        {
            let l_engine_page = PageLayout.push_column(l_row, [Styles.Width_1_3]);
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



let app = document.getElementById("app");


router.add(new Route(Pages.Welcome, (p_url: string) =>
{
    app.innerHTML = "";

    HeaderMenuElement.build(app);

    let l_articles: Article[] = [];

    {
        let l_article: Article = new Article();
        l_article.title = "Welcome";
        l_article.date = new Date(Date.now());
        l_article.push_paragraph("This website is a notebook for myself for writing a custom engine.");
        l_article.push_image("http://image.noelshack.com/fichiers/2016/24/1466366209-risitas24.png");
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
        ArticleElement.build(app, l_articles[i]);
    }

    return true;
}));

router.add(new Route(Pages.Engine, (p_url: string) =>{

    app.innerHTML = "";
    HeaderMenuElement.build(app);

    let l_main_container = PageLayout.push_main_container(app);
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
        PageLayout.push_paragraph(l_main_container, "The philosophy of the engine source code is to : ");
        PageLayout.push_list(l_main_container, [
            "Use third party libraries as little as possible. The aim being to acquire knowledge as much as possible.",
            "Using C++ as \"C with template engine.\". Other C++ features are rarely used."
        ]);
    }
    
    return true;
}));

// On startup
router.navigate(Pages.Welcome);