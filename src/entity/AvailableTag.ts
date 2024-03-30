import { Entity, PrimaryColumn } from "typeorm";

@Entity()
export class AvailableTag {
    @PrimaryColumn()
    tag_name: string
}
