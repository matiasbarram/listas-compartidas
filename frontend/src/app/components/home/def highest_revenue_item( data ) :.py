def highest_revenue_item(data):
    count_dict = {}
    price_dict = {}
    row_data = data.split(" ")
    # row_data = ['111,5\n111,5\n111,5\n222,3\n333,6\n333,6']
    products_data = row_data[0].split("\n")
    # products_data = ['111,5', '111,5', '111,5', '222,3', '333,6', '333,6']
    print(products_data)
    for row in products_data:
        print(row)
        break
        txn = row.split(",")
        product_id = int(txn[0])
        price = int(txn[1])

        if product_id in count_dict:
            count_dict[product_id] += 1
        else:
            count_dict[product_id] = 1
            price_dict[product_id] = price

    most_common_item = 0
    most_revenue = 0

    print(count_dict)
    print(price_dict)
    for product in count_dict:
        product_revenue = price_dict[product] * count_dict[product]
        print(product_revenue)
        if product_revenue > most_revenue:
            most_revenue = product_revenue
            most_common_item = product

    if most_revenue != 0:
        return most_common_item


data = """
33,2
33,2
33,2
33,2
33,2
33,2
33,2
33,2
33,2
"""
most_common = highest_revenue_item(data)
print(most_common)
