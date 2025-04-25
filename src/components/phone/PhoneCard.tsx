import { Phone } from "../../modules/phone/domain/Phone"
import "../../styles/phones.css"

interface PhoneCardProps {
  phone: Phone
}

export const PhoneCard = ({ phone }: PhoneCardProps) => {
  return (
    <a href={`/phone/${phone.id}`} className="phone-card">
      <img
        src={phone.imageUrl}
        alt={phone.name}
        className="phone-card__image"
      />
      <div className="phone-card__content">
        <div className="phone-card__brand">{phone.brand}</div>
        <h2 className="phone-card__model">{phone.name}</h2>
        <div className="phone-card__price">{phone.basePrice}€</div>
      </div>
    </a>
  )
}
