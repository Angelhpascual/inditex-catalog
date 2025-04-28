import { Phone } from "../../modules/phone/domain/Phone"
import { Link } from "react-router-dom"
import "../../styles/phones.css"

interface PhoneCardProps {
  phone: Phone
}

export const PhoneCard = ({ phone }: PhoneCardProps) => {
  return (
    <Link to={`/phones/${phone.id}`} className="phone-card">
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
    </Link>
  )
}
