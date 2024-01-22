
export interface WindowProps {
	children: React.ReactNode;
	title: string;
	rows: number;
	behavior: Behavior;
	}


export interface ImageSlotProps {
	src: string |  undefined;
	alt: string | undefined;
	link: string;
	select: Function; 
	connectionId: string;
}

export interface ComponentConfig {
	type: ComponentType;
	quantity: number;
	parameters: ComponentProps[];
}

export type ComponentType = 'ImageSlot' // Add more types like '| "another component type";
// Union type
export type ComponentProps = ImageSlotProps; // can add more with |

export type Behavior = 'fixed' | 'additive';



