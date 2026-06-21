import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import AddItemForm from "../addItemForm"

const mockMutate = vi.fn()
const mockCloseModal = vi.fn()
const mockCreateToast = vi.fn()

vi.mock("next/navigation", () => ({
    useParams: () => ({ slug: "test-group", listId: "123" }),
}))

vi.mock("next-auth/react", () => ({
    useSession: () => ({ data: { token: "mock-token" } }),
}))

vi.mock("@tanstack/react-query", () => ({
    useMutation: () => ({
        mutateAsync: mockMutate,
        data: null,
        isLoading: false,
    }),
    useQueryClient: () => ({
        setQueryData: vi.fn(),
    }),
}))

vi.mock("@/lib/actions/item/items", () => ({
    createItem: vi.fn().mockResolvedValue({ id: 1 }),
}))

vi.mock("@/lib/common", () => ({
    createToast: (...args: unknown[]) => mockCreateToast(...args),
}))

beforeEach(() => {
    vi.clearAllMocks()
})

describe("AddItemForm", () => {
    it("renders all form fields", () => {
        render(<AddItemForm closeModal={mockCloseModal} />)

        expect(screen.getByLabelText("Producto")).toBeInTheDocument()
        expect(screen.getByText("Cantidad")).toBeInTheDocument()
        expect(screen.getByLabelText("Comentarios")).toBeInTheDocument()
        expect(screen.getByRole("button", { name: "Agregar" })).toBeInTheDocument()
    })

    it("auto-focuses the description input on mount", () => {
        render(<AddItemForm closeModal={mockCloseModal} />)

        expect(screen.getByLabelText("Producto")).toHaveFocus()
    })

    it("increments quantity when pressing + button", async () => {
        const user = userEvent.setup()
        render(<AddItemForm closeModal={mockCloseModal} />)

        const plusButton = screen.getByText("+")
        await user.click(plusButton)

        expect(screen.getByText("2")).toBeInTheDocument()
    })

    it("decrements quantity when pressing - button", async () => {
        const user = userEvent.setup()
        render(<AddItemForm closeModal={mockCloseModal} />)

        const minusButton = screen.getByText("−")
        const plusButton = screen.getByText("+")

        await user.click(plusButton)
        await user.click(plusButton)
        expect(screen.getByText("3")).toBeInTheDocument()

        await user.click(minusButton)
        expect(screen.getByText("2")).toBeInTheDocument()
    })

    it("does not decrement quantity below 1", async () => {
        const user = userEvent.setup()
        render(<AddItemForm closeModal={mockCloseModal} />)

        const minusButton = screen.getByText("−")
        await user.click(minusButton)

        expect(screen.getByText("1")).toBeInTheDocument()
    })

    it("does not increment quantity above 100", async () => {
        const user = userEvent.setup()
        render(<AddItemForm closeModal={mockCloseModal} />)

        const plusButton = screen.getByText("+")

        for (let i = 0; i < 101; i++) {
            await user.click(plusButton)
        }

        expect(screen.getByText("100")).toBeInTheDocument()
    })

    it("shows validation error when description is empty on submit", async () => {
        const user = userEvent.setup()
        render(<AddItemForm closeModal={mockCloseModal} />)

        const submitButton = screen.getByRole("button", { name: "Agregar" })
        await user.click(submitButton)

        expect(screen.getByText("Nombre es obligatorio")).toBeInTheDocument()
    })

    it("calls mutate and closeModal on valid submit", async () => {
        const user = userEvent.setup()
        render(<AddItemForm closeModal={mockCloseModal} />)

        await user.type(screen.getByLabelText("Producto"), "Leche")
        await user.type(screen.getByLabelText("Comentarios"), "Descremada")

        const submitButton = screen.getByRole("button", { name: "Agregar" })
        await user.click(submitButton)

        expect(mockMutate).toHaveBeenCalledWith({
            description: "Leche",
            quantity: 1,
            comments: "Descremada",
        })
        expect(mockCloseModal).toHaveBeenCalled()
    })

    it("submits with custom quantity", async () => {
        const user = userEvent.setup()
        render(<AddItemForm closeModal={mockCloseModal} />)

        await user.type(screen.getByLabelText("Producto"), "Arroz")

        const plusButton = screen.getByText("+")
        await user.click(plusButton)
        await user.click(plusButton)
        await user.click(plusButton)

        const submitButton = screen.getByRole("button", { name: "Agregar" })
        await user.click(submitButton)

        expect(mockMutate).toHaveBeenCalledWith({
            description: "Arroz",
            quantity: 4,
            comments: "",
        })
    })

    it("renders quantity buttons with correct accessibility", () => {
        render(<AddItemForm closeModal={mockCloseModal} />)

        const buttons = screen.getAllByRole("button")
        const quantityButtons = buttons.filter(
            (btn) => btn.textContent === "+" || btn.textContent === "−",
        )
        expect(quantityButtons).toHaveLength(2)
    })
})
