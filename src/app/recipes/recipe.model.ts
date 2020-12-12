export class Recipe {
    public name: string
    public description: string
    public imageUrl: string

    constructor(name: string, description: string, imageUrl: string) {
        this.name = name
        this.description = description
        this.imageUrl = imageUrl
    }
}
