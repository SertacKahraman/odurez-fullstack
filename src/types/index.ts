export interface User {
    id: number;
    ID?: number;
    username: string;
    role: string;
    firstName?: string;
    lastName?: string;
}

export interface Fakulte {
    id?: number;
    ID?: number;
    name: string;
    ad?: string;
}

export interface Salon {
    id?: number;
    ID?: number;
    name: string;
    ad?: string;
    fakulte_id?: number;
    fakulte?: Fakulte;
}

export interface Rezervasyon {
    id?: number;
    ID?: number;
    baslik: string;
    aciklama: string;
    date: string;
    startTime: string;
    endTime: string;
    tur: string;
    fakulte_id?: number;
    salon_id?: number;
    user_id?: number;
    fakulte?: Fakulte;
    salon?: Salon;
    user?: User;
}
