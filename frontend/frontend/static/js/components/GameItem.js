export default class GameItem {
    constructor({ id, name, description, photoUrl }) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.photoUrl = photoUrl;
    }

    render() {
        return `
            <div style="text-align: center; padding: 20px; width: 50%;">
                <h4 style="font-weight: bold; margin-bottom: 10px;">${this.name}</h5>
                <img src="${this.photoUrl}" alt="${this.name}" style="width: 200px; margin-bottom: 10px;">
                <p style="color: grey;">${this.description}</p>
            </div>
        `;
    }
}