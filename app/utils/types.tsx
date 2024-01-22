
export interface WindowProps {
	children: React.ReactNode;
	title: string;
	rows: number;
	behavior: Behavior;
	}


export interface ImageSlotProps {
	src: string;
	alt: string;
	link: string;
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



